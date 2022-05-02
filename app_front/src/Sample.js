import React from 'react';
import { Link } from 'react-router-dom';

class Sample extends React.Component {

    render() {
        return (
            <div>
                Sample!
                <br />
                <Link to={`/`}>Go To App</Link>
            </div>
        );
    }
}

export default Sample;

