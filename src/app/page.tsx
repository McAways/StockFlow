'use client'

import Image from "next/image";
import styles from "./page.module.scss";
import LoginForm from "@/components/LoginForm";
import { useEffect, useState } from 'react'
import { LoggedUser } from "@/utils/interface";
import UserService from "@/services/accessAPI";

export default function Home() {

  const [loggedUser, setLoggedUser] = useState<{ username: string; role: string }>({
    username: "",
    role: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");

      if (token) {
        try {
          const loggedUserRes = await UserService.getAuthenticatedUser(token);
          setLoggedUser(loggedUserRes.data);
        } catch (err) {
          console.error("Erro ao buscar usuário:", err);
        }
      }
    };

    fetchData();
  }, []);


  return (
    <main className={styles.mainContainer}>
      <div className={styles.contentContainer}>

        <Image alt='' src='/backteste.jpg' width={1920} height={1080} className={styles.systemLogo} priority quality={100} />
        <div className={styles.loginForm}>

          <LoginForm userAuthorities={[loggedUser.role]} />


        </div>

      </div>

    </main>
  )
}