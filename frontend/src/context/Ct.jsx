import { createContext, useState } from "react";

const Ct = createContext();

export const CtProvider = ({ children }) => {
    const [state, setState] = useState({ token: "", uid: "", name: "", role: "" });

    const updstate = (data) => {
        setState({ ...state, ...data });
    };

    return (
        <Ct.Provider value={{ state, updstate }}>
            {children}
        </Ct.Provider>
    );
};

export default Ct;
