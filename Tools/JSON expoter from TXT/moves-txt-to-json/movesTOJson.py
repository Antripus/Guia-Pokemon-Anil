import json

def parse_moves(file_path):
    moves = []

    with open(file_path, 'r', encoding='utf-8-sig') as file:  # Especificar la codificación
        lines = file.readlines()

    for line in lines:
        line = line.strip()

        # Ignorar líneas vacías
        if not line:
            continue

        # Dividir la línea por comas
        data = line.split(',')

        # Crear un diccionario para cada movimiento
        move = {
            "id": int(data[0].strip()),
            "name_en": data[1].strip(),
            "name_es": data[2].strip(),
            "effect_code": data[3].strip(),
            "power": int(data[4].strip()) if data[4].strip().isdigit() else None,
            "type": data[5].strip(),
            "category": data[6].strip(),
            "accuracy": int(data[7].strip()) if data[7].strip().isdigit() else None,
            "pp": int(data[8].strip()) if data[8].strip().isdigit() else None,
            "effect_chance": int(data[9].strip()) if data[9].strip().isdigit() else None,
            "target": data[10].strip(),
            "priority": int(data[11].strip()) if data[11].strip().isdigit() else None,
            "flags": data[12].strip(),
            "description": data[13].strip().strip('"')  # Remover comillas
        }

        # Agregar el movimiento a la lista
        moves.append(move)

    return moves

def save_to_json(data, output_file):
    with open(output_file, 'w', encoding='utf-8') as outfile:  # Especificar la codificación
        json.dump(data, outfile, indent=4, ensure_ascii=False)

# Usar las funciones
moves_data = parse_moves('moves.txt')
save_to_json(moves_data, 'moves_data.json')
print(f"Los datos de los entrenadores se han guardado en moves_data.json")