import { useReducer } from "react";
import Context from "./Context";
import reducer, { initState } from "./reducer";
import logger from "./logger";

function Provider({ children }) {
    const [state, dispath] = useReducer(logger(reducer), initState);
    return (
        <Context.Provider value={[state, dispath]}>
            {children}
        </Context.Provider>
    )
}
export default Provider;