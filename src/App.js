import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AllRoute from "./components/AllRoutes";
import { Provider } from "react-redux";
import store from "./redux/store";
import { fetchUser } from "./redux/accountSlice";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";

function App() {
  return (
    <Provider store={store}>
      <InitApp />
    </Provider>
  );
}

const InitApp = () => {
  const dispatch = useDispatch();
  const isAppLoading = useSelector((state) => state.account.isAppLoading);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (isAppLoading) {
    return <LoadingSpinner />;
  }

  return <AllRoute />;
};

export default App;
