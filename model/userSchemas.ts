import * as yup from 'yup';

// Schema único para cadastro de usuário (signup/criação/atualização)
export const usuarioSchema = yup.object({
  name: yup.string().required('Nome obrigatório'),
  email: yup
    .string()
    .email('E-mail inválido')
    .required('E-mail obrigatório'),
  password: yup
    .string()
    .min(8, 'Senha muito curta')
    .max(15, 'Senha muito longa')
    .required('Senha obrigatória'),
});


export const loginSchema = yup.object({
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: yup.string().min(8, 'Senha muito curta').required('Senha obrigatória'),
});
