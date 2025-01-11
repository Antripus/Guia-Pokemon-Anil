import json

# Función para procesar las estadísticas base
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

# Función para procesar movimientos
def parse_moves(moves_line):
    moves = moves_line.split(",")
    parsed_moves = [{"level": int(moves[i]), "move": moves[i + 1].capitalize()} for i in range(0, len(moves), 2)]
    return parsed_moves

# Función para procesar evoluciones
def parse_evolutions(evolutions_line):
    evolutions = evolutions_line.split(",")
    evolutions_list = []
    for i in range(0, len(evolutions), 3):
        evolution = {"name": evolutions[i].capitalize()}
        if i + 1 < len(evolutions):
            evolution["method"] = evolutions[i + 1]
        if i + 2 < len(evolutions) and evolutions[i + 2]:
            evolution["item_or_condition"] = evolutions[i + 2]
        evolutions_list.append(evolution)
    return evolutions_list

# Leer archivo TXT
with open("pokemon.txt", "r", encoding="utf-8") as file:
    lines = file.readlines()

# Lista para almacenar Pokémon procesados
pokemon_list = []
current_pokemon = {}
evolution_map = {}

# Procesar líneas para construir pre-evolución y evolución base
for line in lines:
    line = line.strip()

    if line.startswith("[") and line.endswith("]"):
        if current_pokemon:
            pokemon_list.append(current_pokemon)

        current_pokemon = {"number": int(line.strip("[]"))}

    elif "=" in line:
        key, value = line.split("=", 1)
        key = key.lower().strip()
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
            current_pokemon["moves"] = parse_moves(value)
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
            current_pokemon["evolutions"] = parse_evolutions(value)
            for evolution in current_pokemon["evolutions"]:
                evolution_name = evolution["name"].upper()
                evolution_map[evolution_name] = {"pre": current_pokemon["name"]}
        elif key == "type1":
            if "type" not in current_pokemon:
                current_pokemon["type"] = []
            current_pokemon["type"].append(value.capitalize())
        elif key == "type2" and value:
            current_pokemon["type"].append(value.capitalize())

# Agregar última entrada a la lista
if current_pokemon:
    pokemon_list.append(current_pokemon)

# Determinar stages recorriendo el mapa de pre-evoluciones
for pokemon in pokemon_list:
    internal_name = pokemon["internal_name"].upper()
    pre_evolution = evolution_map.get(internal_name, {}).get("pre", "Ninguna")
    pokemon["pre_evolution"] = pre_evolution

    # Calcular stage evolutivo
    stage = 1
    while pre_evolution != "Ninguna":
        pre_internal = next(
            (p["internal_name"].upper() for p in pokemon_list if p["name"] == pre_evolution), None
        )
        if pre_internal:
            pre_evolution = evolution_map.get(pre_internal, {}).get("pre", "Ninguna")
            stage += 1
        else:
            break

    pokemon["evolution_stage"] = stage

# Guardar en JSON
with open("pokemon.json", "w", encoding="utf-8") as json_file:
    json.dump(pokemon_list, json_file, indent=4, ensure_ascii=False)


with open("pokemon_evolution_map.json", "w", encoding="utf-8") as json_file:
    json.dump(evolution_map, json_file, indent=4, ensure_ascii=False)

print("Archivo JSON creado con éxito.")
