import React from "react";
import Footer from "../../components/users/Footer";
import Menu from "../../components/users/menu";
import Navbar from "../../components/users/Navbar";
import Newletter from "../../components/users/Newletter";
import StoreProvider from "../../store/Provider";
const AppUser = ({ children }) => {
    return (
        <>
            <StoreProvider>
                <Menu />
                <Navbar />
                {children}
                <Newletter />
                <Footer />
            </StoreProvider>

        </>
    );
}

export default AppUser;