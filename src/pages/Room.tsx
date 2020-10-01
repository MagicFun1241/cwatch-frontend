import React from "react";

// @ts-ignore
import { DefaultPlayer as Video } from 'react-html5video';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { Snackbar } from "@material-ui/core";

import 'react-html5video/dist/styles.css';
import SocketClient from "../classes/socketClient";

import { useParams } from "react-router-dom";

const connection = new SocketClient();

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Room = () => {
    const [errorOpened, setErrorOpened] = React.useState(false);
    const [errorText, setErrorText] = React.useState("");

    const { id } = useParams();

    connection.onConnected = () => {
        console.log("Connected");

        connection.request("enterRoom", {
            params: {
              roomId: id
            },
            callback: body => {
                if (body.error == null) {

                } else {
                    setErrorText(body.error.message);
                    setErrorOpened(true);
                }
            }
        });
    };
    
    connection.on("error", message => {
        setErrorText(message.error.message);
        setErrorOpened(true);
    });
    
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setErrorOpened(false);
    };

    return <>
        <div className="video-container">
            <Video
                controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
                poster="https://zhstatic.zhihu.com/cfe/griffith/zhihu2018.jpg"
                onPlay={() => {
                    connection.send({
                        type: "event",
                        eventType: "play"
                    });
                }}
                onPause={() => {
                    connection.send({
                        type: "event",
                        eventType: "pause"
                    });
                }}>
                <source src="https://vortesnail.github.io/qier-player-demo/static/media/video720p.fc81bd78.mp4" type="video/mp4" />
            </Video>
        </div>
        <Snackbar open={errorOpened} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" >
                {errorText}
            </Alert>
        </Snackbar>
    </>;
};

export default Room;