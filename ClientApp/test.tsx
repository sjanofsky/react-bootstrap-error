import * as React from "react";

import {Tabs,Tab} from "react-bootstrap";

class Test extends React.Component<any,any> {
    constructor(props:any) {
        super(props);
    }

    render() {
        return (
            <div>
                Test....

                <Tabs defaultActiveKey={1}>
                    <Tab eventKey={1} title="tab 1">tab 1 content</Tab>
                    <Tab eventKey={2} title="tab 2">tab 2 content</Tab>
                </Tabs>
            </div>
        )
    }
}

export default Test;