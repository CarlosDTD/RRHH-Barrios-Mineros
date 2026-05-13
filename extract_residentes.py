import pandas as pd
import sqlite3
import os

def process_residentes(file_path, db_path):
    print(f"Procesando Residentes: {file_path}")
    # Leer el excel. Los datos empiezan en la fila 8 (índice 7)
    df = pd.read_excel(file_path, sheet_name='ASSOS-RESIDENTES', skiprows=7)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Mapeo: A=Nº, B=Item(0), C=CI, D=Exp, E=Paterno, F=Materno, G=Nombres, H=Dependencia, I=Tipo, J=Ingreso, K=Culminacion, L=RotDe, M=RotA, N=FechaRot, O=Obs, P=Celular
    
    for index, row in df.iterrows():
        if pd.isna(row.iloc[2]): # Si no hay CI
            continue
            
        ci = str(row.iloc[2]).split('.')[0]
        ext = str(row.iloc[3])
        paterno = str(row.iloc[4])
        materno = str(row.iloc[5])
        nombres = str(row.iloc[6])
        cargo = "RESIDENTE"
        
        # Insertar o actualizar Personal
        cursor.execute('''
        INSERT OR REPLACE INTO personal (ci, exp, apellido_paterno, apellido_materno, nombres, item_boleta, item_memo, cargo, tipo_personal)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (ci, ext, paterno, materno, nombres, "0", "0", cargo, 'RESIDENTE'))
        
        # Insertar datos de Rotación
        cursor.execute('''
        INSERT INTO rotaciones (personal_ci, fecha_ingreso, fecha_culminacion, rotacion_de, rotacion_a, observaciones_rotacion)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', (ci, str(row.iloc[9]), str(row.iloc[10]), str(row.iloc[11]), str(row.iloc[12]), str(row.iloc[14])))

        # Procesar asistencia diaria (Días 1 al 30 están a partir de la columna Q, índice 16)
        for dia in range(1, 31):
            col_idx = 15 + dia # Día 1 está en índice 16
            val = row.iloc[col_idx]
            
            if pd.notna(val):
                horas = 0
                obs = ""
                if isinstance(val, (int, float)):
                    horas = float(val)
                else:
                    obs = str(val)
                
                fecha = f"2026-04-{dia:02d}"
                
                cursor.execute('''
                INSERT INTO asistencia_diaria (personal_ci, fecha, horas_trabajadas, minutos_atraso, observacion)
                VALUES (?, ?, ?, ?, ?)
                ''', (ci, fecha, horas, 0, obs))

    conn.commit()
    conn.close()
    print("Finalizado procesamiento de Residentes.")

if __name__ == "__main__":
    db = 'D:/RRHH-Barrios-Mineros/asistencia.db'
    excel = 'D:/RRHH-Barrios-Mineros/Statefolder/PLANILLA DE ASISTENCIA PERSONAL RESIDENTES ABR HBM.xlsx'
    process_residentes(excel, db)
