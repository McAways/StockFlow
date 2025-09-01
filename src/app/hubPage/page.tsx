'use client'
import { useState } from "react";
import styles from "./page.module.scss";

interface GFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
}

export default function HubPage() {
  const [files, setFiles] = useState<GFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderStack, setFolderStack] = useState<{id: string, name: string}[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false); // indica se já carregou arquivos

  const fetchFiles = (folderId?: string) => {
    setLoading(true);
    const query = folderId ? `?folderId=${folderId}` : "";
    fetch(`/api/list${query}`)
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          console.error("Erro na API:", res.status, text);
          return [];
        }
        return res.json();
      })
      .then(data => {
        setFiles(Array.isArray(data) ? data : []);
        setHasLoaded(true);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const enterFolder = (folder: GFile) => {
    setFolderStack(prev => [...prev, { id: folder.id, name: folder.name }]);
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
      <h3>Hub de Arquivos</h3>

      {!hasLoaded && (
        <button className={styles.backButton} onClick={() => fetchFiles()}>
          Carregar arquivos
        </button>
      )}

      {folderStack.length > 0 && (
        <button className={styles.backButton} onClick={goBack}>← Voltar</button>
      )}

      {loading && <p>Carregando arquivos...</p>}
      {hasLoaded && !loading && files.length === 0 && <p>Nenhum arquivo encontrado.</p>}

      <div className={styles.cardsContainer}>
        {files.map(file => (
          <div
            key={file.id}
            className={`${styles.card} ${file.mimeType === "application/vnd.google-apps.folder" ? styles.folder : ""}`}
            onClick={() => {
              if (file.mimeType === "application/vnd.google-apps.folder") enterFolder(file);
            }}
          >
            <div className={styles.fileName}>
              {file.mimeType === "application/vnd.google-apps.folder" ? "📁 " : "📄 "}
              {file.name}
            </div>

            {file.mimeType !== "application/vnd.google-apps.folder" && (
              <div className={styles.links}>
                {file.webViewLink && (
                  <a href={file.webViewLink} target="_blank" rel="noreferrer">Visualizar</a>
                )}
                {file.webContentLink && (
                  <a href={file.webContentLink} target="_blank" rel="noreferrer">Baixar</a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
