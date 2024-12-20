import { Form, Input, Button, Link } from "@nextui-org/react";
import { FormEvent, useContext, useState } from "react";
import styles from './Registration.module.css';
import axios from "axios";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";

export const Registration = () => {

  const [ errors, setErrors ] = useState({});
  const { store } = useContext(Context);
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(e.currentTarget instanceof HTMLFormElement) {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(
          Array.from(formData.entries()).map(([key, value]) => [key, value.toString()])
      );

      if(data.password !== data.password2) {
        setErrors({
          password: 'Пароли не совпадают',
          password2: 'Пароли не совпадают'
        });
        return
      }

      try {
        await store.registration(data.login, data.password);
        navigate("/");
      }
      catch(error) {
        if(axios.isAxiosError(error)) {
          if(error.response) {
            const data = error.response.data;
            if(data.message) {
              console.log(data.message);
              setErrors({
                login: data.message[0],
                password: data.message[0]
              });
            }
          }
        }
      }
    }
    else {
      const newErrors = {
        login: 'Введите логин',
        password: 'Введите пароль'
      };
      setErrors(newErrors);
    }
  }

  return (
    <div className="flex w-full justify-center items-center h-screen">
      <div className={styles.registrationFormContainer}>
        <Form
          className="justify-center items-center w-full"
          validationBehavior="native"
          validationErrors={errors}
          onSubmit={onSubmit}
        >
          <div className="flex flex-col gap-4 w-full">
            <Input
              minLength={5}
              maxLength={64}
              isRequired
              label="Логин"
              errorMessage="Введите корректный логин"
              labelPlacement="outside"
              name="login"
              description="От 5 до 64 символов"
              variant="bordered"
            />
            <Input
              isRequired
              minLength={5}
              maxLength={64}
              label="Пароль"
              type="password"
              errorMessage="Введите корректный пароль"
              labelPlacement="outside"
              name="password"
              description="От 5 до 64 символов"
              variant="bordered"
            />
            <Input
              isRequired
              minLength={5}
              maxLength={64}
              label="Пароль еще раз"
              type="password"
              errorMessage="Введите корректный пароль"
              labelPlacement="outside"
              name="password2"
              description="От 5 до 64 символов"
              variant="bordered"
            />
            <div className="flex gap-4">
              <Button
                className="w-full"
                color="primary"
                type="submit"
              >
                Зарегистрироваться
              </Button>
              <Button
                type="reset"
                variant="bordered"
              >
                Сброс
              </Button>
            </div>
            <Button
              as={Link}
              href="/login"
              showAnchorIcon
              variant="bordered"
            >
              Назад
            </Button>
          </div>
        </Form>  
      </div>
    </div>
  )

}