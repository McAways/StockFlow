'use client'

import styles from "./page.module.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "../FormInput";

import LoadingDots from "../LoadingDots";
import UserService from "@/services/accessAPI";
import Image from "next/image";

interface LoginFormProps {
    userAuthorities: Array<string>
}

export default function LoginForm({ userAuthorities }: LoginFormProps) {

    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showErrorMessage, setShowErrorMessage] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [isVisiblePassword, setIsVisiblePassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function handleLogin(event: any) {
        event.preventDefault()

        if (email == '' && password == '') {
            setShowErrorMessage(true)
            setErrorMessage("Preencha os campos corretamente")

            setTimeout(() => {
                setShowErrorMessage(false)
                setErrorMessage('')
            }, 3000)

            return
        }

        setShowErrorMessage(false)
        setIsLoading(true)
        const res = await UserService.logon(email, password)

        if (res.status != 200) {
            setIsLoading(false)
            setShowErrorMessage(true)
            setErrorMessage("Usuário ou senha incorreta")

            setTimeout(() => {
                setShowErrorMessage(false)
                setErrorMessage('')
            }, 3000)
        }
        else {
            sessionStorage.setItem('token', res.data)
            setIsLoading(false)
            const authUser = await UserService.getAuthenticatedUser(res.data)
            const userAuthorities = authUser.data.authorities.map((item: any) => item.authority)

            if (userAuthorities.includes('ROLE_POINT_USER')) {
                router.push('/hubPage')
            }
            else {
                router.push('/hubPage')
            }
        }
    }

    return (
        <form className={styles.accessForm} data-aos="fade-right"
            onMouseMove={(e) => {
                const rect = (e.currentTarget as HTMLFormElement).getBoundingClientRect();
                const x = e.clientX - rect.left; // posição do mouse dentro do form
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // calcular deslocamento relativo ao centro (-1 a 1)
                const offsetX = (x - centerX) / centerX;
                const offsetY = (y - centerY) / centerY;

                // intensidade do efeito
                const intensity = 10; // quanto maior, mais o box-shadow "segue" o mouse

                // criar box-shadow dinâmico
                const shadowX = offsetX * intensity;
                const shadowY = offsetY * intensity;
                const blur = 40;

                (e.currentTarget as HTMLFormElement).style.boxShadow = `
      ${shadowX}px ${shadowY}px ${blur}px #7f139dde,
      0 8px 32px rgba(0, 0, 0, 0.25)
    `;
            }}
            onMouseLeave={(e) => {
                // resetar sombra quando o mouse sair
                (e.currentTarget as HTMLFormElement).style.boxShadow =
                    '0 8px 32px rgba(0, 0, 0, 0.25)';
            }}
        >

            <h2 style={{ fontWeight: 400 }}> Realizar Login</h2>

            <div className={styles.inputContainer}>


                <div className={styles.passwordContainer}>

                    <FormInput
                        inputClass={styles.formGroup}
                        labelClass={'mx-2 ' + styles.labelWidth1}
                        type={"email"}
                        className={styles.formInput}
                        id={"email"}
                        placeholder={"Email"}
                        value={email}
                        handleUpdate={(event: any) => setEmail(event.currentTarget.value)}
                        fontColor={'#fff'}
                    />

                    <Image alt='' src='/email.png' width={26} height={26} className={styles.emailBtn} priority />
                </div>
                <div className={styles.passwordContainer}>
                    <FormInput
                        inputClass={styles.formGroup}
                        labelClass={styles.labelWidth2}
                        type={isVisiblePassword ? 'text' : 'password'}
                        className={styles.formInput2}
                        id={"password"}
                        placeholder={"Senha"}
                        value={password}
                        handleUpdate={(event: any) => setPassword(event.currentTarget.value)}
                        fontColor={'#fff'}
                    />
                    {
                        isVisiblePassword ?

                            <div onClick={() => setIsVisiblePassword(!isVisiblePassword)}>
                                <svg
                                    className={styles.passwordBtn}
                                    xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill="#fff" >
                                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                                </svg>
                            </div>
                            :
                            <div onClick={() => setIsVisiblePassword(!isVisiblePassword)}>
                                <svg
                                    className={styles.passwordBtn}
                                    xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill="#fff">
                                    <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                                </svg>
                            </div>
                    }

                </div>
            </div>

            <div className={styles.responseContainer}>

                {
                    isLoading ?
                        <div className={styles.loader}>
                            <LoadingDots />
                        </div>

                        :

                        <div className={styles.btnContainer}>
                            <button
                                className={styles.actionBtn}
                                type="submit"
                                onClick={handleLogin}
                            >
                                ENTRAR
                            </button>
                        </div>
                }

                <div className={styles.messageContainer}>

                    {
                        showErrorMessage ?
                            <span style={{ color: '#ff8b8b' }}> {errorMessage} </span>

                            :

                            ''
                    }
                </div>
            </div>
        </form >
    )
}