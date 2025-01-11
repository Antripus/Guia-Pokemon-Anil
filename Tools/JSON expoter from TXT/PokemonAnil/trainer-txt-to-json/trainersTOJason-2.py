import json

def parse_trainer_data(file_path):
    trainers = []
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()
    
    i = 0
    while i < len(lines):
        if lines[i].startswith('#'):
            i += 1
            trainer_data = {}
            # Nombre del sprite del entrenador (lo ignoramos)
            trainer_data['sprite'] = lines[i].strip()
            i += 1
            # Nombre del entrenador y variante (si existe)
            trainer_name_data = lines[i].strip()
            trainer_name_parts = trainer_name_data.split(',')
            trainer_data['name'] = trainer_name_parts[0].strip()
            trainer_data['variant'] = int(trainer_name_parts[1].strip()) if len(trainer_name_parts) > 1 else None
            i += 1
            # Número de Pokémon y objeto curativo (si existe)
            trainer_pokemon_data = lines[i].strip()
            pokemon_info = trainer_pokemon_data.split(',')
            trainer_data['num_pokemon'] = int(pokemon_info[0])
            trainer_data['healing_item'] = pokemon_info[1] if len(pokemon_info) > 1 else None
            i += 1

            # Lista de Pokémon
            trainer_data['pokemons'] = []
            for _ in range(trainer_data['num_pokemon']):
                pokemon_line = lines[i].strip()
                pokemon_info = pokemon_line.split(',')
                
                pokemon = {}
                pokemon['name'] = pokemon_info[0].strip()
                pokemon['level'] = int(pokemon_info[1].strip())

                # Usar un enfoque más seguro para acceder a los elementos
                pokemon['item'] = pokemon_info[2].strip() if len(pokemon_info) > 2 and pokemon_info[2] else None
                pokemon['moves'] = pokemon_info[3:7] if len(pokemon_info) > 3 else []  # Movimientos (puede haber hasta 4)

                # Habilidad, si existe, de lo contrario, asignar 'X'
                pokemon['ability'] = pokemon_info[7].strip() if len(pokemon_info) > 7 and pokemon_info[7].strip() else 'X'
                
                # Naturaleza, si existe, de lo contrario, asignar 'Unknown'
                pokemon['nature'] = pokemon_info[11].strip() if len(pokemon_info) > 10 and pokemon_info[11].strip() else 'Unknown'

                # Guardamos el Pokémon
                trainer_data['pokemons'].append(pokemon)
                i += 1

            # Añadimos el entrenador procesado a la lista de entrenadores
            trainers.append(trainer_data)
        else:
            i += 1  # Ignorar líneas que no contienen información relevante
    
    return trainers




def save_to_json(data, output_file):
    with open(output_file, 'w') as outfile:
        json.dump(data, outfile, indent=4)

# Función principal
def main():
    input_file = 'trainers.txt'
    output_file = 'trainers.json'
    
    trainers_data = parse_trainer_data(input_file)
    save_to_json(trainers_data, output_file)
    print(f"Los datos de los entrenadores se han guardado en {output_file}")

if __name__ == "__main__":
    main()
