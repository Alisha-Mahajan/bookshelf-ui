import {createContext, lazy, Suspense, useEffect, useReducer} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import {
  AdminHome,
  Dashboard,
  Footer,
  Header,
  NotFound,
  UserEntry,
} from '../components';
import PrivateRoute from '../core/PrivateRoute';
import {IAppContext, RootReducer} from '../reducers';
import {refresh, useAppDispatch, useAppSelector} from '../redux';
import {Overlay} from '../shared/components';
import styles from './App.module.scss';

const initialAppState: IAppContext = {
  searchText: '',
  books: [],
  cartItems: [],
};

export const AppContext = createContext(null);

function App() {
  const [appState, dispatchAppAction] = useReducer(
    RootReducer,
    initialAppState,
  );

  const dispatch = useAppDispatch();
  const userEntryState = useAppSelector(state => state.auth.userEntryState);
  const currentUser = useAppSelector(state => state.auth.user);

  // admin routes
  const UserList = lazy(() => import('../components/Admin/UserList'));
  const BookList = lazy(() => import('../components/Admin/BookList'));
  const AddBook = lazy(() => import('../components/AddBook/AddBook'));

  // user routes
  const UserProfile = lazy(
    () => import('../components/UserProfile/UserProfile'),
  );
  const BookDetail = lazy(() => import('../components/BookDetail/BookDetail'));
  const CartList = lazy(() => import('../components/CartList/CartList'));
  const Cart = lazy(() => import('../components/Cart/Cart'));
  const StripeContainer = lazy(
    () => import('../components/Payment/StripeContainer/StripeContainer'),
  );

  // common routes
  const Orders = lazy(() => import('../components/Orders/Orders'));
  const AboutUs = lazy(
    () => import('../components/FooterLinks/AboutUs/AboutUs'),
  );
  const TermsAndConditions = lazy(
    () =>
      import('../components/FooterLinks/TermsAndConditions/TermsAndConditions'),
  );
  const Payments = lazy(
    () => import('../components/FooterLinks/Payments/Payments'),
  );

  useEffect(() => {
    dispatch(refresh());
  }, []);

  return (
    <Router>
      <div className={styles.pageContainer}>
        <AppContext.Provider value={{appState, dispatchAppAction}}>
          <Header />
          <div className={styles.wrapper}>
            <Suspense fallback={<Overlay showBackdrop={true} />}>
              <Routes>
                <Route
                  path="/"
                  element={currentUser?.isAdmin ? <AdminHome /> : <Dashboard />}
                />
                {currentUser?.isAdmin ? (
                  <>
                    <Route path="/users" element={<UserList />} />
                    <Route path="/books" element={<BookList />} />
                    <Route path="/books/new" element={<AddBook />} />
                  </>
                ) : (
                  <>
                    <Route
                      path="/profile"
                      element={
                        <PrivateRoute>
                          <UserProfile />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/cart"
                      element={
                        <PrivateRoute>
                          <CartList />
                        </PrivateRoute>
                      }
                    />
                    <Route path="/books/:id" element={<BookDetail />} />
                    <Route
                      path="/buy"
                      element={
                        <PrivateRoute>
                          <Cart />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/payment"
                      element={
                        <PrivateRoute>
                          <StripeContainer />
                        </PrivateRoute>
                      }
                    />
                  </>
                )}
                <Route
                  path="/orders"
                  element={
                    <PrivateRoute>
                      <Orders />
                    </PrivateRoute>
                  }
                />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            {!!userEntryState && <UserEntry showForm={userEntryState} />}
          </div>
        </AppContext.Provider>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
