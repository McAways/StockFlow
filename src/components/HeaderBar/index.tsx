'use client'
import { useEffect, useState } from "react"
import Image from "next/image"
import styles from "./page.module.scss"
import Link from "next/link"

interface UserData {
    id: string,
    username: string,
    role: string,
}

export default function HeaderBar() {
    const [showMenu, setShowMenu] = useState(false)
    const [user, setUser] = useState<UserData | null>(null)

    useEffect(() => {
        const storedUser = sessionStorage.getItem("authUser")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
    }, [])

    return (
        <main className={styles.mainContainer}>
            <Link href={'/'}>
                <Image alt='' src='/returnIcon.png' width={25} height={25} priority className={styles.returnIcon} />
            </Link>

            

            <div className={styles.titleContainer}>
                <h2 className={styles.titleText}>Stock Flow</h2>
                <Image
                    alt=''
                    src='/stockFlow.png'
                    width={30}
                    height={30}
                    className={styles.headericon}
                />
            </div>

            <div className={styles.userMenuContainer}>
                <Image
                    alt=''
                    src='/personIcon.png'
                    width={30}
                    height={30}
                    className={styles.userIcon}
                    onClick={() => setShowMenu(!showMenu)}
                />

                {showMenu && user && (
                    <div className={styles.dropdownMenu}>
                        <div>
                            <div className={styles.userDataName}><Image alt='' src='/personIcon.png' width={25} height={25} priority />: {user.username}</div>

                        </div>
                        <div>
                            <div className={styles.userDataRole}> <Image alt='' src='/roleIcon.png' width={20} height={20} priority className={styles.roleIcon}/>: {user.role}</div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
