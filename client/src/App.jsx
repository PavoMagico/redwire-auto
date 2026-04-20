import { Routes, Route } from 'react-router-dom';
import Navbar        from './components/Navbar';
import Footer        from './components/Footer';
import Home          from './pages/Home';
import Test          from './pages/Test';
import Results       from './pages/Results';
import Login         from './pages/Login';
import Register      from './pages/Register';
import Garage        from './pages/Garage';
import Dealership    from './pages/Dealership';
import VehicleDetail from './pages/VehicleDetail';
import Admin         from './pages/Admin';
import PrivateRoute  from './components/PrivateRoute';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/test"          element={<Test />} />
        <Route path="/resultados"    element={<Results />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/registro"      element={<Register />} />
        <Route path="/concesionario" element={<Dealership />} />
        <Route path="/vehiculo/:id"  element={<VehicleDetail />} />
        <Route path="/garaje"        element={<PrivateRoute><Garage /></PrivateRoute>} />
        <Route path="/admin"         element={<PrivateRoute adminOnly><Admin /></PrivateRoute>} />
      </Routes>
      <Footer />
    </div>
  );
}
