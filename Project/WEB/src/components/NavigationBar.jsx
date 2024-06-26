import { useEffect, useState } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { loginRequest, b2cPolicies } from "../authConfig";
import { NavLink, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import logo from "../assets/Logo.svg";
import "../styles/App.css";
import config from "../utils/conf";
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import Cart from "./Cart/Cart";

export const NavigationBar = () => {
  const { instance, inProgress } = useMsal();
  const [userType, setUserType] = useState(null);
  const location = useLocation();

  let activeAccount;

  useEffect(() => {
    const links = document.querySelectorAll(".NavLinks");
    links.forEach((link) => {
      const id = link.getAttribute("id");
      const currentPath = location.pathname;
      const isActive = currentPath === `/${id}`;
      link.classList.toggle("active-link", isActive);
    });
  }, [location.pathname]);

  useEffect(() => {
    if (instance) {
      activeAccount = instance.getActiveAccount();
      if (activeAccount) {
        const homeAccountId = activeAccount.homeAccountId;
        const parts = homeAccountId.split('-');
        const ID_Usuario = parts.slice(0, 5).join('-');
        fetchUserType(ID_Usuario);
      }
    }
  }, [instance]);

  const fetchUserType = async (userId) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/usertype/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUserType(data.Tipo);
    } catch (error) {
      console.error('Error fetching user type:', error);
    }
  };

  const handleLoginRedirect = () => {
    instance.loginRedirect(loginRequest).catch((error) => console.log(error));
  };

  const handleLogoutRedirect = () => {
    instance.logoutRedirect();
  };

  const handleProfileEdit = () => {
    if (inProgress === InteractionStatus.None) {
      instance.acquireTokenRedirect(b2cPolicies.authorities.editProfile);
    }
  };

  return (
    <>
      <nav className="NavigationBar">
        <NavLink className="navbar-brand" to={"/"} id="/">
          <img
            src={logo}
            alt="Logo"
            height="65"
            className="d-inline-block align-top"
          />
        </NavLink>
        <AuthenticatedTemplate>
          {userType === 'Administrador' && (
            <>
              <div className="Navbar-Links">
                <NavLink id="Ventas" to="/Ventas" className="NavLinks">
                  Ventas
                </NavLink>
              </div>
              <div className="Navbar-Links">
                <NavLink id="Inventory" to="/Inventory" className="NavLinks">
                  Inventario
                </NavLink>
              </div>
              <div className="Navbar-Links">
                <NavLink id="NewProduct" to="/NewProduct" className="NavLinks">
                  Añadir Producto
                </NavLink>
              </div>
            </>
          )}
          {userType === 'Normal' && (
            <>
            <div className="Navbar-Links">
              <NavLink id="MisPedidos" to="/MisPedidos" className="NavLinks">
                Mis Pedidos
              </NavLink>
            </div>
            <div className="Navbar-Links">
            <NavLink id="Products" to="/Products" className="NavLinks">
              Productos
            </NavLink>
          </div>
          </>
          )}
          <div className="Navbar-Profile">
          {userType === 'Normal' && (
            <div className="justify-content-center">
              <Cart></Cart>
            </div>
            )}
            <Button as="button" onClick={handleLogoutRedirect}>
              Cerrar sesion
            </Button>
          </div>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <div>
            <Button
              className="ml-auto cta-button"
              onClick={handleLoginRedirect}
            >
              Iniciar sesión
            </Button>
          </div>
        </UnauthenticatedTemplate>
      </nav>
    </>
  );
};