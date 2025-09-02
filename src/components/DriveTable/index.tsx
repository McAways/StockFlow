'use client'
import { useState } from "react";
import styles from "./page.module.scss";
import { motion } from "framer-motion";
import { FaFolder, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAlt } from "react-icons/fa";


interface GFile {
    id: string;
    name: string;
    mimeType: string;
    webViewLink?: string;
    webContentLink?: string;
}

function getFileIcon(mimeType: string) {
    switch (mimeType) {
        case "application/vnd.google-apps.folder":
            return <FaFolder color="#fbc02d" />;

        case "application/pdf":
            return <FaFilePdf color="#e53935" />;

        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        case "application/msword":
            return <FaFileWord color="#1e88e5" />;

        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        case "application/vnd.ms-excel":
            return <FaFileExcel color="#43a047" />;

        case "image/png":
        case "image/jpeg":
        case "image/jpg":
        case "image/gif":
            return <FaFileImage color="#8e24aa" />;

        default:
            return <FaFileAlt color="#757575" />;
    }
}

export default function DriveTable() {
    const [files, setFiles] = useState<GFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [folderStack, setFolderStack] = useState<{ id: string; name: string }[]>([]);
    const [hasLoaded, setHasLoaded] = useState(false);

    const fetchFiles = (folderId?: string) => {
        setLoading(true);
        const query = folderId ? `?folderId=${folderId}` : "";
        fetch(`/api/list${query}`)
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    console.error("Erro na API:", res.status, text);
                    return [];
                }
                return res.json();
            })
            .then((data) => {
                setFiles(Array.isArray(data) ? data : []);
                setHasLoaded(true);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    const enterFolder = (folder: GFile) => {
        setFolderStack((prev) => [...prev, { id: folder.id, name: folder.name }]);
        setCurrentFolderId(folder.id);
        fetchFiles(folder.id);
    };

    const goBack = () => {
        const newStack = [...folderStack];
        newStack.pop();
        setFolderStack(newStack);
        const prevFolder = newStack.length > 0 ? newStack[newStack.length - 1].id : null;
        setCurrentFolderId(prevFolder);
        fetchFiles(prevFolder || undefined);
    };

    return (
        <main className={styles.mainContainer}>
            <div className={styles.mainContainerTitle}>
                <h3>Hub de Arquivos</h3>

                {!hasLoaded && (
                    <button className={styles.backButton} onClick={() => fetchFiles()}>
                        Carregar arquivos
                    </button>
                )}

                {folderStack.length > 0 && (
                    <button className={styles.backButton} onClick={goBack}>
                        ← Voltar
                    </button>
                )}
            </div>

            {loading && (
                <motion.div
                    className={styles.loader}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
            )}

            {hasLoaded && !loading && files.length === 0 && <p>Nenhum arquivo encontrado.</p>}

            {hasLoaded && !loading && (
                <div className={styles.cardsContainer}>
                    {files.map((file) => (
                        <motion.div
                            key={file.id}
                            className={`${styles.card} ${file.mimeType === "application/vnd.google-apps.folder" ? styles.folder : ""
                                }`}
                            onClick={() => {
                                if (file.mimeType === "application/vnd.google-apps.folder") enterFolder(file);
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className={styles.fileName}>
                                <div className={styles.fileIcon}>
                                    {getFileIcon(file.mimeType)}
                                </div>
                                <div className={styles.fileNameText}>{file.name}</div>
                            </div>

                            {file.mimeType !== "application/vnd.google-apps.folder" && (
                                <div className={styles.links}>
                                    {file.webViewLink && (
                                        <a href={file.webViewLink} target="_blank" rel="noreferrer">
                                            Visualizar
                                        </a>
                                    )}
                                    {file.webContentLink && (
                                        <a href={file.webContentLink} target="_blank" rel="noreferrer">
                                            Baixar
                                        </a>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </main>
    );
}
