
DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '4069075';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 0, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 4, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 5, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 19, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 25, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '12');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '7303214';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 132.0, 22, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 12, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 19, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 25, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '12');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '3093704';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 144.0, 0, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '12');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '7261279';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 0, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 4, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 12, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 18, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '12.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '7452191';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 84.0, 0, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, 'VA');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, 'CA');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, 'F');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 4, 'CI');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 5, 'ON');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, 'VA');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, 'CA');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, 'CI');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, 'O');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, 'N');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 11, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 26, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '12');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '5764295';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 45, 'MEDIO DIA DE HABER POR 45 MINUTOS DE ATRASO', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 4, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 11, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 18, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 25, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '12');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '5746616';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 11, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 18, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '12.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '57486230';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 0, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 18, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '12.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '4057830';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 78.0, 37, 'MEDIO DIA DE HABER POR 37 MINUTOS DE ATRASO', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 4, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 11, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, 'V');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, 'A');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, 'C');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, 'A');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 25, 'C');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 26, 'I');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, 'O');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, 'N');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '3510115';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 0, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 11, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 26, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '12');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '5748668';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 0, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 5, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 11, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 26, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '6.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '5748710';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 0, '2/04/2026 HORARIO CONTINUO', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, 'F');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '6.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '5068645';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 0, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 5, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 11, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 26, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '12');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '7266965';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 0, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 4, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 25, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 26, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '12');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '3096037';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 0, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, 'F');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '6.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '4053756';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 132.0, 0, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 4, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 12, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '12');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '5762414';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 0, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 4, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 19, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 25, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '12');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '5742527';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 57, 'UN DIA DE HABER POR 57 MINUTOS DE ATRASO', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 4, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 5, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '18');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 11, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '18.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 18, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 25, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '12');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '7291586';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 15, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, 'F');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '6.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '5771565';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 0, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, 'F');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '6.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '6477224';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 28, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 5, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 12, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 19, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 26, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '12');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '5728930';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 11, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 5, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 19, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '12');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '1913928';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 160.0, 13, '10/04/2026 COMISION MINISTERIO PROGRAMA DE PREV Y REHAB.', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, 'F');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, 'C');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '8.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '8.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '8.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '8.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '8.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '8.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '8.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '7319837';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 0, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 4, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 11, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 12, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 18, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 26, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '12');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '3548339';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 13, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 12, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 25, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '12.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '3118528';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 168.0, 0, '2/04/2026 HORARIO CONTINUO', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, 'F');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '8.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '8.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '8.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '8.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '8.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '8.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '8');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '8.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '9213678';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 0, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, 'F');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '6.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '5060612';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 84.0, 0, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 5, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, 'V');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, 'A');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, 'C');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 25, 'A');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 26, 'C');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, 'I');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, 'O');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, 'N');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '7287100';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 49, 'UN DIA DE HABER POR 49 MINUTOS DE ATRASO', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '12.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '3540846';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 11, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, 'F');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '6.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '5763422';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 12, '', 'MINISTERIAL')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 12, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '12');

    END IF;
END $$;
DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '7329638';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 312.0, 0, '', 'RESIDENTE')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 11, '30.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '30.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 25, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 26, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '36.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '3545600';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 390.0, 0, '', 'RESIDENTE')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, '30.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 4, '24.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '30.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '24.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '30.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 12, '30.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '30.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '30.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 18, '24.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '24.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '24.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 25, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 26, '24.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '36.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '7297350';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 402.0, 0, '', 'RESIDENTE')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 4, '24.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '30.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 19, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 25, '30.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '30.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '73184225';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 186.0, 0, '', 'RESIDENTE')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 11, '54.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '72.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 25, '12.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '12677857';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 408.0, 0, '', 'RESIDENTE')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, '24.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 4, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 5, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 11, '24.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 25, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 26, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '36.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '7426998';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 426.0, 0, '', 'RESIDENTE')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, '36');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '48.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, '30.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '30.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 19, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '36.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '36.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '4059599';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 17, '', 'RESIDENTE')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 4, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 11, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 18, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 25, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '12.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '5769241';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 59, 'UN DIA DE HABER POR 59 MINUTOS DE ATRAO', 'RESIDENTE')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, 'F');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '6.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '14078903';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 0, '', 'RESIDENTE')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 5, '18.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 18, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '6.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '7331102';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 0, '', 'RESIDENTE')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 12, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '12.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '7336752';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 168.0, 34, '', 'RESIDENTE')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, '12');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 4, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 11, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 18, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 19, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 25, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 26, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '6.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '7336759';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 0, '', 'RESIDENTE')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 12, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 26, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '6.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '7455009';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 132.0, 0, '', 'RESIDENTE')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 4, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 11, '24.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 19, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 25, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '12.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '7270795';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 56, 'UN DIA DE HABER POR 56 MINUTOS DE ATRASO', 'RESIDENTE')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, '6');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 19, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '12.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '5727301';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 11, '', 'RESIDENTE')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 1, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 3, 'F');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 6, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 7, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 8, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 10, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 14, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 15, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 20, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 21, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 22, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 24, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 27, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 28, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 29, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '6.0');

    END IF;
END $$;

DO $$
DECLARE
    p_id INTEGER;
    a_id INTEGER;
BEGIN
    SELECT id INTO p_id FROM personal WHERE ci = '74000015';
    IF p_id IS NOT NULL THEN
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
        VALUES (p_id, 4, 2026, 126.0, 0, '', 'RESIDENTE')
        ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO UPDATE SET 
            total_horas = EXCLUDED.total_horas,
            total_atrasos_min = EXCLUDED.total_atrasos_min,
            observaciones = EXCLUDED.observaciones
        RETURNING id INTO a_id;
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 2, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 5, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 9, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 11, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 12, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 13, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 16, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 17, '6.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 23, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 25, '12.0');
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor) VALUES (a_id, 30, '12.0');

    END IF;
END $$;