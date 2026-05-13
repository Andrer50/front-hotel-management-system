import * as Yup from "yup";

export const registerValidationSchema = Yup.object().shape({
    firstName: Yup.string().required("El nombre es requerido"),
    lastName: Yup.string().required("El apellido es requerido"),
    email: Yup.string().email("Email inválido").required("El email es requerido"),
    phone: Yup.string().required("El teléfono es requerido"),
    password: Yup.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .required("La contraseña es requerida"),
    repeatPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir")
        .required("Repetir la contraseña es requerido"),
});
