import { useState } from "react";
import axios from "axios";
import "./App.css";

const COUNTRIES = [
  "Argentina", "Bolivia", "Brasil", "Chile", "Colombia",
  "Costa Rica", "Cuba", "Ecuador", "El Salvador", "España",
  "Estados Unidos", "Guatemala", "Honduras", "México",
  "Nicaragua", "Panamá", "Paraguay", "Perú",
  "República Dominicana", "Uruguay", "Venezuela",
];

function App() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    cvFile: null,
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, cvFile: file }));
    setErrors((prev) => ({ ...prev, cvFile: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "El nombre es obligatorio";
    if (!form.lastName.trim()) errs.lastName = "El apellido es obligatorio";
    if (!form.email.trim()) {
      errs.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = "Email inválido";
    }
    if (!form.country) errs.country = "Selecciona un país";
    if (!form.cvFile) {
      errs.cvFile = "Debes adjuntar tu CV en PDF";
    } else if (form.cvFile.type !== "application/pdf") {
      errs.cvFile = "Solo se permiten archivos PDF";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification(null);

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("first_name", form.firstName.trim());
    formData.append("last_name", form.lastName.trim());
    formData.append("email", form.email.trim());
    formData.append("country", form.country);
    formData.append("cv_file", form.cvFile);

    try {
      await axios.post("/api/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNotification({ type: "success", text: "CV recibido exitosamente" });
      setSubmitted(true);
    } catch (err) {
      const detail =
        err.response?.data?.message ||
        err.response?.data?.cv_file?.[0] ||
        "Error al enviar el CV. Intenta nuevamente.";
      setNotification({ type: "error", text: detail });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1>Cargar Currículum</h1>
      <p className="subtitle">Completa el formulario para adjuntar tu CV</p>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.text}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="firstName">Nombre</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
            className={errors.firstName ? "error" : ""}
            disabled={submitted}
            placeholder="Tu nombre"
          />
          {errors.firstName && (
            <div className="error-text">{errors.firstName}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Apellido</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={handleChange}
            className={errors.lastName ? "error" : ""}
            disabled={submitted}
            placeholder="Tu apellido"
          />
          {errors.lastName && (
            <div className="error-text">{errors.lastName}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
            disabled={submitted}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && (
            <div className="error-text">{errors.email}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="country">País</label>
          <select
            id="country"
            name="country"
            value={form.country}
            onChange={handleChange}
            className={errors.country ? "error" : ""}
            disabled={submitted}
          >
            <option value="">Selecciona un país</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.country && (
            <div className="error-text">{errors.country}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="cvFile">CV (PDF)</label>
          <input
            id="cvFile"
            name="cvFile"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className={errors.cvFile ? "error" : ""}
            disabled={submitted}
          />
          {errors.cvFile && (
            <div className="error-text">{errors.cvFile}</div>
          )}
        </div>

        <button type="submit" disabled={submitted || loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}

export default App;
