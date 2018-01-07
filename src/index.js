import React from "react";
import ReactDOM from "react-dom";
import SpaceInvaders from "./components/SpaceInvaders";

ReactDOM.render(
    <SpaceInvaders width={640} height={480} initialEnemies={70} />,
    document.getElementById("root")
);
