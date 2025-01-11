# Ruta al archivo TXT
file_path = "pokemon.txt"

# Lista para almacenar los resultados
pokemon_list = []

# Leer y procesar el archivo
with open(file_path, "r", encoding="utf-8") as file:
    for line in file:
        line = line.strip()  # Elimina espacios en blanco al inicio y al final
        if line.startswith("[") and line.endswith("]"):
            # Extrae el número del Pokémon
            pokemon_number = line.strip("[]")
        elif line.startswith("Name="):
            # Extrae el nombre del Pokémon
            pokemon_name = line.split("=", 1)[1]
            # Agrega el resultado a la lista en el formato deseado
            pokemon_list.append(f"{pokemon_number}-{pokemon_name}")

# Exportar los resultados como una cadena separada por comas
output = ",".join(pokemon_list)

# Guardar en un archivo o imprimir en consola
output_file = "pokemon_names.csv"
with open(output_file, "w", encoding="utf-8") as file:
    file.write(output)

# Guarda el resultado en un archivo txt
with open('pokemon_names.txt', 'w', encoding='utf-8') as output_file:
    output_file.write(output)


print(f"Exportado con éxito: {output}")


