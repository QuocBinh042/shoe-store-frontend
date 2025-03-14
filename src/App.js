import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AllRoute from "./components/AllRoutes";
import { Provider } from "react-redux";
import store from "./redux/store";
import { fetchUser } from "./redux/accountSlice";

function App() {
  return (
    <Provider store={store}>
      <InitApp />
    </Provider>
  );
}

const InitApp = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);


  return (
    <>
      <AllRoute />
    </>
  );
};

export default App;
