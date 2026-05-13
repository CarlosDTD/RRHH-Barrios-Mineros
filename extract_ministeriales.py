import pandas as pd
import sqlite3
import os

def process_ministeriales(file_path, db_path):
    print(f"Procesando Ministeriales: {file_path}")
    # Leer el excel. Los datos empiezan en la fila 6 (índice 5)
    df = pd.read_excel(file_path, sheet_name='ASISTENCIAL - ADMINISTRATIVO', skiprows=5)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Mapeo de columnas basado en el análisis previo
    # A=Nº, B=Item Memo, C=Item Boleta, D=CI, E=Ext, F=Paterno, G=Materno, H=Nombres, I=Cargo Memo, J=Cargo Actual
    
    for index, row in df.iterrows():
        if pd.isna(row.iloc[4]): # Si no hay CI, saltar (usualmente fin de tabla o basura)
            continue
            
        ci = str(row.iloc[4]).split('.')[0] # Limpiar CI si viene como float
        ext = str(row.iloc[5])
        paterno = str(row.iloc[6])
        materno = str(row.iloc[7])
        nombres = str(row.iloc[8])
        item_memo = str(row.iloc[2])
        item_boleta = str(row.iloc[3])
        cargo = str(row.iloc[10]) # Cargo Actual
        
        # Insertar o actualizar Personal
        cursor.execute('''
        INSERT OR REPLACE INTO personal (ci, exp, apellido_paterno, apellido_materno, nombres, item_boleta, item_memo, cargo, tipo_personal)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (ci, ext, paterno, materno, nombres, item_boleta, item_memo, cargo, 'MINISTERIAL'))
        
        # Procesar asistencia diaria (Días 1 al 30 están en las columnas N a AQ, índices 13 a 42 aprox)
        # Según el excel leído: M=1 (índice 12), ..., AU es el final.
        # Vamos a iterar los días del 1 al 30.
        for dia in range(1, 31):
            col_idx = 12 + dia # El día 1 está en la columna 13 (N)
            val = row.iloc[col_idx]
            
            if pd.notna(val):
                horas = 0
                obs = ""
                if isinstance(val, (int, float)):
                    horas = float(val)
                else:
                    obs = str(val) # Marcas como 'F', 'V', etc.
                
                fecha = f"2026-04-{dia:02d}"
                
                cursor.execute('''
                INSERT INTO asistencia_diaria (personal_ci, fecha, horas_trabajadas, minutos_atraso, observacion)
                VALUES (?, ?, ?, ?, ?)
                ''', (ci, fecha, horas, 0, obs)) # Minutos atraso se calcula en otra fase o se saca del total

    conn.commit()
    conn.close()
    print("Finalizado procesamiento de Ministeriales.")

if __name__ == "__main__":
    db = 'D:/RRHH-Barrios-Mineros/asistencia.db'
    excel = 'D:/RRHH-Barrios-Mineros/Statefolder/CONSOLIDADO DE ASISTENCIA MINISTERIALES ABR H.B.M..xlsx'
    process_ministeriales(excel, db)
