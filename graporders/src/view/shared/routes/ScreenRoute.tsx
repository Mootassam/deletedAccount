import { Route, Redirect, useLocation } from "react-router-dom";
import permissionCheker from "../../../modules/auth/permissionChecker";
// import LayoutPage from "../../layout/LayoutPage";

function ScreenRoute({ component: Component, currentTenant,currentUser, ...reset }) {
  const location = useLocation();
  return (
    <Route
      {...reset}
      render={(props) => {
        const permissionChecker = new permissionCheker(currentUser,currentTenant);
        if (!permissionChecker.isAuthenticated) {
          return (
            <Redirect
              to={{ pathname: "/get-started", state: { from: location } }}
            />
          );
        }
        return (
          <div className="children__content">
            <Component {...props} />
          </div>
        );
      }}
    />
  );
}

export default ScreenRoute;
