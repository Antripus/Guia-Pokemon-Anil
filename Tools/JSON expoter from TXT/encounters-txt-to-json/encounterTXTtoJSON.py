import json

def parse_encounters(file_path, output_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
    except UnicodeDecodeError:
        with open(file_path, 'r', encoding='latin-1') as file:
            lines = file.readlines()

    data = []
    current_zone = None
    current_method = None

    for i, line in enumerate(lines):
        line = line.strip()

        if line.startswith("#########################"):
            if current_zone:
                # Limpiar duplicados en cada método
                for method, encounters in current_zone["encounters"].items():
                    seen = set()
                    current_zone["encounters"][method] = [
                        e for e in encounters if not (e["pokemon"] in seen or seen.add(e["pokemon"]))
                    ]
                data.append(current_zone)
            current_zone = {"nro_zona": "", "nombre_zona": "", "encounters": {}}
            current_method = None  # Reiniciar el método actual para la nueva zona

            # Extraer la información de la zona desde la línea siguiente
            if i + 1 < len(lines):
                zone_line = lines[i + 1].strip()
                if "#" in zone_line:
                    zone_info = zone_line.split("#", 1)
                    current_zone["nro_zona"] = zone_info[0].strip()
                    current_zone["nombre_zona"] = zone_info[1].strip()

        elif line in ["Land", "LandClassic", "OldRod", "OldRodClassic", "Water", "WaterClassic"]:
            current_method = line
            if current_zone:  # Validar si hay una zona activa
                current_zone["encounters"][current_method] = []

        elif "," in line:
            if current_zone and current_method:
                pokemon_data = line.split(",")
                if len(pokemon_data) == 3:
                    pokemon_name = pokemon_data[0].strip()
                    try:
                        min_level = int(pokemon_data[1])
                        max_level = int(pokemon_data[2])
                    except ValueError:
                        print(f"Error parsing levels in line: {line}")
                        continue
                    current_zone["encounters"][current_method].append({
                        "pokemon": pokemon_name,
                        "min_level": min_level,
                        "max_level": max_level
                    })

    # Añadir la última zona
    if current_zone:
        for method, encounters in current_zone["encounters"].items():
            seen = set()
            current_zone["encounters"][method] = [
                e for e in encounters if not (e["pokemon"] in seen or seen.add(e["pokemon"]))
            ]
        data.append(current_zone)

    # Guardar como JSON
    with open(output_path, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4, ensure_ascii=False)

    print(f"Encounters data has been exported to {output_path}")

# Ruta del archivo de entrada y salida
input_file = "encounters.txt"
output_file = "encounters.json"

# Ejecutar la función
parse_encounters(input_file, output_file)
