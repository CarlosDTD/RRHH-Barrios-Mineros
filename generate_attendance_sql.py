import pandas as pd
import json
import os

# Usamos la herramienta postgres_execute_sql de forma indirecta mediante un script de generación
def generate_sql_for_attendance(file_path, mes, anio, tipo):
    print(f"Generando SQL para {tipo}: {file_path}")
    df = pd.read_excel(file_path, sheet_name=0, skiprows=5 if "MINISTERIAL" in tipo else 7)
    
    sql_statements = []
    
    for index, row in df.iterrows():
        try:
            # CI está en col 4 para Ministeriales y col 2 para Residentes
            ci_idx = 4 if "MINISTERIAL" in tipo else 2
            if pd.isna(row.iloc[ci_idx]): continue
            ci = str(row.iloc[ci_idx]).split('.')[0].strip()
            
            # Totales: Col 43/44 para Min, 46/47 para Res (aproximado)
            # Para Ministeriales: 43=Hrs, 44=Atrasos, 45=Obs
            # Para Residentes: 46=Hrs, 47=Atrasos, 48=Obs (según el read_sheet previo)
            
            if "MINISTERIAL" in tipo:
                hrs = float(row.iloc[43]) if pd.notna(row.iloc[43]) else 0
                atr = int(row.iloc[44]) if pd.notna(row.iloc[44]) else 0
                obs = str(row.iloc[45]) if pd.notna(row.iloc[45]) else ''
                dia_start_idx = 13 # N
            else:
                hrs = float(row.iloc[46]) if pd.notna(row.iloc[46]) else 0
                atr = int(row.iloc[47]) if pd.notna(row.iloc[47]) else 0
                obs = str(row.iloc[48]) if pd.notna(row.iloc[48]) else ''
                dia_start_idx = 16 # Q
            
            # Escapar comillas en obs
            obs = obs.replace("'", "''")
            
            stmt = f"""
DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '{ci}';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, {mes}, {anio}, {hrs}, {atr}, '{obs}', '{tipo}')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
"""
            # Días
            for dia in range(1, 31):
                val = row.iloc[dia_start_idx + dia - 1]
                if pd.notna(val):
                    val_str = str(val).replace("'", "''")
                    stmt += f"        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, {dia}, '{val_str}');\n"
            
            stmt += """
    END IF;
END $$;"""
            sql_statements.append(stmt)
            
        except Exception as e:
            continue
            
    return sql_statements

if __name__ == "__main__":
    # Ministeriales
    statements = generate_sql_for_attendance(
        'D:/RRHH-Barrios-Mineros/Statefolder/CONSOLIDADO DE ASISTENCIA MINISTERIALES ABR H.B.M..xlsx', 
        4, 2026, 'MINISTERIAL'
    )
    # Escribir a un archivo para procesar por bloques
    with open('D:/RRHH-Barrios-Mineros/import_attendance.sql', 'w', encoding='utf-8') as f:
        f.write("\n".join(statements))
    
    # Residentes
    statements_res = generate_sql_for_attendance(
        'D:/RRHH-Barrios-Mineros/Statefolder/PLANILLA DE ASISTENCIA PERSONAL RESIDENTES ABR HBM.xlsx', 
        4, 2026, 'RESIDENTE'
    )
    with open('D:/RRHH-Barrios-Mineros/import_attendance.sql', 'a', encoding='utf-8') as f:
        f.write("\n".join(statements_res))
    
    print(f"SQL generado: {len(statements) + len(statements_res)} sentencias.")
