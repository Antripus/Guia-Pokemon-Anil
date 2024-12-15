import json

# Cargar datos desde el archivo trainers.json
with open("trainers.json", "r", encoding="utf-8") as file:
    trainers_data = json.load(file)

# Crear un diccionario para agrupar entrenadores por nombre
trainers_by_name = {}
for trainer in trainers_data:
    name = trainer["name"]
    if name not in trainers_by_name:
        trainers_by_name[name] = []
    trainers_by_name[name].append(trainer)

# Identificar entrenadores "importantes" y agregar el campo "tipo de encuentro"
for name, trainers in trainers_by_name.items():
    # Obtener las variantes del entrenador
    variants = {trainer.get("variant") for trainer in trainers}  # Usar un conjunto para evitar duplicados

    # Verificar si cumple los criterios de "importante"
    is_important = variants == {None, 1, 2}

    # Asignar el tipo de encuentro a cada entrenador
    for trainer in trainers:
        trainer["tipo de encuentro"] = "importante" if is_important else "normal"

# Guardar los datos actualizados en un nuevo archivo
with open("trainers_TipoDeEncuentro.json", "w", encoding="utf-8") as file:
    json.dump(trainers_data, file, indent=4, ensure_ascii=False)

print("Archivo actualizado guardado como 'trainers_TipoDeEncuentro.json'")
