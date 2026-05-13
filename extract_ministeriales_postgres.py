import pandas as pd
import psycopg2
import os

def process_ministeriales_postgres(file_path):
    print(f"Procesando Ministeriales para Postgres: {file_path}")
    df = pd.read_excel(file_path, sheet_name='ASISTENCIAL - ADMINISTRATIVO', skiprows=5)
    
    # Conexión directa con psycopg2 para evitar problemas de SCRAM en Node temporalmente
    conn = psycopg2.connect(
        dbname="rrhh_barrios_mineros",
        user="postgres",
        password="postgres",
        host="localhost"
    )
    cursor = conn.cursor()
    
    mes = 4
    anio = 2026
    tipo_planilla = 'MINISTERIAL'
    
    success = 0
    errors = 0
    
    for index, row in df.iterrows():
        try:
            if pd.isna(row.iloc[4]): continue
            ci = str(row.iloc[4]).split('.')[0].strip()
            
            # 1. Obtener personal_id
            cursor.execute("SELECT id FROM personal WHERE ci = %s", (ci,))
            res = cursor.fetchone()
            if not res:
                # print(f"CI {ci} no encontrado")
                errors += 1
                continue
            personal_id = res[0]
            
            # 2. Extraer totales
            total_horas = float(row.iloc[43]) if pd.notna(row.iloc[43]) else 0
            total_atrasos = int(row.iloc[44]) if pd.notna(row.iloc[44]) else 0
            obs = str(row.iloc[45]) if pd.notna(row.iloc[45]) else None
            
            # 3. Upsert asistencia_mensual
            cursor.execute("""
                INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (personal_id, mes, anio, tipo_planilla) 
                DO UPDATE SET 
                    total_horas = EXCLUDED.total_horas,
                    total_atrasos_min = EXCLUDED.total_atrasos_min,
                    observaciones = EXCLUDED.observaciones
                RETURNING id
            """, (personal_id, mes, anio, total_horas, total_atrasos, obs, tipo_planilla))
            asistencia_id = cursor.fetchone()[0]
            
            # 4. Detalle diario (Días 1-30 en col índices 13-42)
            for dia in range(1, 31):
                val = row.iloc[12 + dia]
                if pd.notna(val):
                    cursor.execute("""
                        INSERT INTO asistencia_diaria (asistencia_id, dia, valor)
                        VALUES (%s, %s, %s)
                    """, (asistencia_id, dia, str(val)))
            
            success += 1
        except Exception as e:
            errors += 1
            # print(f"Error en fila {index}: {e}")
            
    conn.commit()
    cursor.close()
    conn.close()
    print(f"Finalizado: {success} exitos, {errors} fallos.")

if __name__ == "__main__":
    excel = 'D:/RRHH-Barrios-Mineros/Statefolder/CONSOLIDADO DE ASISTENCIA MINISTERIALES ABR H.B.M..xlsx'
    process_ministeriales_postgres(excel)
