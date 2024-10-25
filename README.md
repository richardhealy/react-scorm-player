# SCORM Player React Component

## Description

This project provides a React component for playing SCORM (Sharable Content Object Reference Model) content. It's designed to be a simple, reusable component that can be easily integrated into larger React applications.

## Features

- Loads and plays SCORM content
- Handles SCORM API interactions
- Supports SCORM 2004
- Displays loading state
- Customizable through props

## Installation

To install this component in your project, run:

```bash
npm install react-scorm-player
```

Or if you're using yarn:

```bash
yarn add react-scorm-player
```

## Usage

Here's a basic example of how to use the ScormPlayer component:

```jsx
import React from 'react';
import ScormPlayer from 'scorm-player-react';

const MyScormPage = () => {
    
    const onInitialize = () => {

        // After the API is initialized, API.cmi and API_1484_11.cmi will be available to mutate
        window.API.cmi.learner_name = "Richard Fernandez";
    }

    return (
        <ScormPlayer
            manifestUrl="path/to/your/imsmanifest.xml" // url
            onInitialize={onInitialize}
            onComplete={() => console.log('SCORM content completed')}
        />
    );
};
export default MyScormPage;
```

## Props

- `manifestUrl` (string, required): URL to the SCORM manifest file
- `sessionData` (object, optional): Initial SCORM session data
- `className` (string, optional): Additional CSS class for styling
- `onCommit` (function, optional): Callback function for SCORM commit events
- `onFinish` (function, optional): Callback function for when SCORM content finishes
- `onInitialize` (function, optional): Callback function for SCORM initialization
- `onSetValue` (function, optional): Callback function for when SCORM values are set
- `onComplete` (function, optional): Callback function for when SCORM content is completed

## Dependencies

- React
- x2js (for XML parsing)
- scorm-again (for SCORM API implementation)

## Development

To set up the development environment:

1. Clone the repository
2. Install dependencies with `npm install` or `yarn install`
3. Start the development server with `npm start` or `yarn start`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.