'use client'
import { useState } from "react";
import styles from "./page.module.scss";
import HeaderBar from "@/components/HeaderBar";
import DriveTable from "@/components/DriveTable";
import Chart from "@/components/Chart";


export default function HubPage() {

  return (
    <main className={styles.mainContainer}>
      <div className={styles.mainContainerTitle}>
        <HeaderBar></HeaderBar>
      </div>

      <div className={styles.stageTitle}>

        <h3>Análise de dados</h3>
      </div>
      <div className={styles.contentContainer}>

        <div className={styles.driveTableContainer}>
          <DriveTable></DriveTable>
        </div>
        <div>
          <Chart></Chart>
        </div>
        <div>
          <Chart></Chart>
        </div>
      </div>

      <div className={styles.stageTitle2}>

        <h3>Controladores</h3>
      </div>

      <div className={styles.contentContainer}>

        <div className={styles.driveTableContainer}>
          <DriveTable></DriveTable>
        </div>
        <div>
          <Chart></Chart>
        </div>
        <div>
          <Chart></Chart>
        </div>
      </div>

    </main>
  )
}
