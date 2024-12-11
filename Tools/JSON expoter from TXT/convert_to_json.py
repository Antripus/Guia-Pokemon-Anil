import json

# Función para procesar las estadísticas base de cada Pokémon
def parse_base_stats(stats_line):
    stats = list(map(int, stats_line.split(",")))
    return {
        "hp": stats[0],
        "attack": stats[1],
        "defense": stats[2],
        "speed": stats[3],
        "sp_attack": stats[4],
        "sp_defense": stats[5],
        "total": sum(stats)
    }

# Función para procesar los puntos de esfuerzo
def parse_effort_points(effort_line):
    effort_points = list(map(int, effort_line.split(",")))
    return {
        "hp": effort_points[0],
        "attack": effort_points[1],
        "defense": effort_points[2],
        "speed": effort_points[3],
        "sp_attack": effort_points[4],
        "sp_defense": effort_points[5]
    }

# Función para procesar los movimientos
def parse_moves(moves_line):
    moves = moves_line.split(",")
    parsed_moves = [{"level": int(moves[i]), "move": moves[i+1].capitalize()} for i in range(0, len(moves), 2)]
    return parsed_moves

# Función para procesar la evolución
def parse_evolutions(evolutions_line):
    evolutions = evolutions_line.split(",")
    evolutions_list = []
    if len(evolutions) >= 2:
        evolution = {"name": evolutions[0].capitalize(), "method": evolutions[1]}
        if len(evolutions) > 2 and evolutions[2].isdigit():
            evolution["level"] = int(evolutions[2])
        evolutions_list.append(evolution)
    return evolutions_list

# Leer el archivo TXT
with open("pokemon.txt", "r", encoding="utf-8") as file:
    lines = file.readlines()

# Lista para almacenar todos los Pokémon procesados
pokemon_list = []
current_pokemon = {}

# Procesar las líneas y estructurarlas en JSON
for line in lines:
    line = line.strip() # Eliminar espacios en blanco al inicio y al final

    # Asignar el número de Pokémon cuando se encuentra entre corchetes []
    if line.startswith("[") and line.endswith("]"):
        if current_pokemon:  # Si ya había un Pokémon, lo agregamos a la lista
            pokemon_list.append(current_pokemon)
        
        current_pokemon = {}  # Inicializar nuevo Pokémon
        current_pokemon["number"] = int(line.strip("[]"))  # Asignar número#Aca estaba el numero antes
        
    elif "=" in line:
        key, value = line.split("=", 1)
        key = key.strip().lower()
        value = value.strip()

        if key == "name":
            current_pokemon["name"] = value
        elif key == "internalname":
            current_pokemon["internal_name"] = value
        elif key == "basestats":
            current_pokemon["base_stats"] = parse_base_stats(value)
        elif key == "genderrate":
            current_pokemon["gender_rate"] = value
        elif key == "growthrate":
            current_pokemon["growth_rate"] = value
        elif key == "baseexp":
            current_pokemon["base_exp"] = int(value)
        elif key == "effortpoints":
            current_pokemon["effort_points"] = parse_effort_points(value)
        elif key == "rareness":
            current_pokemon["rareness"] = int(value)
        elif key == "happiness":
            current_pokemon["happiness"] = int(value)
        elif key == "abilities":
            current_pokemon["abilities"] = value.split(",")
        elif key == "hiddenability":
            current_pokemon["hidden_ability"] = value
        elif key == "moves":
            current_pokemon["moves"] = parse_moves(value)  # Solo los movimientos del Pokémon base
        elif key == "eggmoves":
            current_pokemon["egg_moves"] = value.split(",")
        elif key == "compatibility":
            current_pokemon["compatibility"] = value.split(",")
        elif key == "stepstohatch":
            current_pokemon["steps_to_hatch"] = int(value)
        elif key == "height":
            current_pokemon["height"] = float(value)
        elif key == "weight":
            current_pokemon["weight"] = float(value)
        elif key == "color":
            current_pokemon["color"] = value
        elif key == "habitat":
            current_pokemon["habitat"] = value
        elif key == "kind":
            current_pokemon["kind"] = value
        elif key == "pokedex":
            current_pokemon["pokedex_description"] = value
        elif key == "evolutions" and value:
            current_pokemon["evolutions"] = parse_evolutions(value)  # Solo agregar la información de la evolución
        elif key == "type1":
            if "type" not in current_pokemon:
                current_pokemon["type"] = []
            current_pokemon["type"].append(value.capitalize())
        elif key == "type2" and value:
            current_pokemon["type"].append(value.capitalize())

# Añadir el último Pokémon al final
if current_pokemon:
    pokemon_list.append(current_pokemon)

# Guardar los datos en formato JSON
with open("pokemon.json", "w", encoding="utf-8") as json_file:
    json.dump(pokemon_list, json_file, indent=4, ensure_ascii=False)

print("Archivo JSON con la estructura corregida creado con éxito.")
