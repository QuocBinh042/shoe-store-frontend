import { useRoutes } from "react-router-dom";
import { routes } from "../../router/router";
function AllRoute() {
  const elements = useRoutes(routes);
  return (
    <>
      {elements}

    </>
  )
}

export default AllRoute;