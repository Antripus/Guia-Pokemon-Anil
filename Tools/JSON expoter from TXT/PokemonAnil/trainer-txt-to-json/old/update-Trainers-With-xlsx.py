import json
import pandas as pd

# Cargar datos desde el archivo trainers.json
with open("trainers.json", "r", encoding="utf-8") as file:
    trainers_data = json.load(file)

# Leer el archivo .xlsx
excel_data = pd.read_excel("Orden-Combates-Importantes.xlsx")

# Convertir el DataFrame en un diccionario para procesarlo
combates_data = excel_data.to_dict(orient="records")

# Crear un diccionario para agrupar entrenadores por nombre
trainers_by_sprite = {}
for trainer in trainers_data:
    sprite = trainer["sprite"]
    if sprite not in trainers_by_sprite:
        trainers_by_sprite[sprite] = []
    trainers_by_sprite[sprite].append(trainer)

# Agregar información a entrenadores
for combate in combates_data:
    sprite = combate["sprite"]
    if sprite in trainers_by_sprite:
        for trainer in trainers_by_sprite[sprite]:
            trainer["Orden"] = combate["Orden"]
            trainer["descripcion_de_entrenador"] = combate["Descripcion del entrenador"]
            trainer["ubicacion"] = combate["Ubicacion"]
            trainer["tipo"] = combate["Tipo"]
            trainer["tipo de combate"] = combate["Tipo De Combate"]

# Guardar los datos actualizados en un nuevo archivo
with open("trainers_actualizados.json", "w", encoding="utf-8") as file:
    json.dump(trainers_data, file, indent=4, ensure_ascii=False)

print("Archivo actualizado guardado como 'trainers_actualizados.json'")
