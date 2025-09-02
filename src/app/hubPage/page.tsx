'use client'
import { useState } from "react";
import styles from "./page.module.scss";
import HeaderBar from "@/components/HeaderBar";
import DriveTable from "@/components/DriveTable";

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
  const [folderStack, setFolderStack] = useState<{ id: string, name: string }[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

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
      <HeaderBar></HeaderBar>
      <div className={styles.contentContainer}>
        <div className={styles.driveTableContainer}>
          <DriveTable></DriveTable>
        </div>
      </div>

    </main>
  );
}
