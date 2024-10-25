import X2JS from "x2js";
import "scorm-again/dist/scorm2004";
import { useEffect, useReducer } from "react";

const styles = {
	container: {
		width: "100%",
		height: "100%",
		border: "none",
		overflow: "hidden"
	},
	iframe: {
		width: "100%",
		height: "100%",
		border: "none"
	},
	loading: {
		width: "100%",
		height: "4px",
		position: "relative",
		overflow: "hidden"
	},
	loadingBar: {
		width: "50%",
		height: "100%",
		backgroundColor: "#60a5fa",
		position: "absolute",
		animation: "loading 1.5s infinite ease-in-out"
	}
};

const xmlToObject = (xmlData) => {
	const x2js = new X2JS();
	return x2js.xml2js(xmlData);
};

const getIMSManifest = async (url) => {
	const result = await fetch(url);
	const content = await result.text();
	return xmlToObject(content);
};

const getUrlFromManifest = (url, content) => {
	const relativeUrl = content?.manifest?.resources?.resource?.file?.[0]?._href;
	if (!relativeUrl) {
		return undefined;
	}

	const endUrl = `${url.replace("imsmanifest.xml", "")}${relativeUrl.replace("./", "")}`;
	return endUrl;
};

const initialState = {
    loading: true,
    moduleUrl: undefined,
    sessionData: {}
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_MODULE_URL':
            return { ...state, moduleUrl: action.payload };
        case 'SET_SESSION_DATA':
            return { ...state, sessionData: { ...state.sessionData, ...action.payload } };
        default:
            return state;
    }
}

export const ReactScormPlayer = ({ sessionData, manifestUrl, className, onCommit, onFinish, onInitialize, onSetValue, onComplete }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {

		window["API_1484_11"] = new window["Scorm2004API"]({ logLevel: 1 });
		const API = window["API_1484_11"];

		if (sessionData) {
			try {
				API.loadFromJSON(
					sessionData
				);
			}
			catch (error) {
				console.error("REACT SCORM PLAYER: couldn't load session data", error)
			}
		}

		API.on("Initialize", onInitialize?.());
    API.on("SetValue", function (prop, value) {
			onSetValue?.(prop, value);
			if (prop === "cmi.completion_status" && value === "completed") {
				onComplete?.();
			}
            dispatch({ type: 'SET_SESSION_DATA', payload: { [prop.replace("cmi.", "")]: value } });
		});

		API.on("Commit", onCommit?.());
    API.on("Terminate", onFinish?.());
	}, [sessionData]);

	useEffect(() => {
		applyManifest();
	}, []);

	const applyManifest = async () => {
		const manifest = await getIMSManifest(manifestUrl);
		const moduleUrl = getUrlFromManifest(manifestUrl, manifest);

		dispatch({ type: 'SET_MODULE_URL', payload: moduleUrl });
	};

	return (
		<div style={{...styles.container, ...(className && {className})}} >
			{state.loading && (
				<div style={styles.loading}>
					<div style={styles.loadingBar}></div>
				</div>
			)}
			{!state.loading && (
				<iframe
					src={moduleUrl}
					allowFullScreen
					style={styles.iframe}
					onLoad={() => dispatch({ type: 'SET_LOADING', payload: false })}
				/>
			)}
		</div>
	)
};

export default ReactScormPlayer;
