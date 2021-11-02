import { useState } from "react";

export default () => {
    const [form, setForm] = useState([]);

    const onChange = (e, { name, value }) => {
        setForm({ ...form, [name]: value });
    };

    const registerFormValid =
        !form.nome?.length ||
        !form.email?.length ||
        !form.cep?.length

    return { form, onChange, registerFormValid };
};