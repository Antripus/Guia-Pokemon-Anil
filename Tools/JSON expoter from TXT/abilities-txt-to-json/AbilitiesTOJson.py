import json

def parse_abilities(file_path):
    abilities = []

    with open(file_path, 'r', encoding='utf-8-sig') as file:  # Especificar la codificación
        lines = file.readlines()

    for line in lines:
        line = line.strip()

        # Ignorar líneas vacías
        if not line:
            continue

        # Dividir la línea por comas
        data = line.split(',')

        # Crear un diccionario para cada habilidad
        ability = {
            "id": int(data[0].strip()),
            "name_en": data[1].strip(),
            "name_es": data[2].strip(),
            "description": data[3].strip().strip('"')  # Remover comillas
        }

        # Agregar la habilidad a la lista
        abilities.append(ability)

    return abilities

def save_to_json(data, output_file):
    with open(output_file, 'w', encoding='utf-8') as outfile:  # Especificar la codificación
        json.dump(data, outfile, indent=4, ensure_ascii=False)


# Función principal
def main():
    input_file = 'abilities.txt'
    output_file = 'abilities.json'
    
    abilities_data = parse_abilities(input_file)
    save_to_json(abilities_data, output_file)
    print(f"Los datos de las abilidades se han guardado en {output_file}")

if __name__ == "__main__":
    main()