# Pokemon-Anil-Pokedex

Sync Visual Studio Code with Github on


Pendiente:
Armar el index, web simple que tenga barra navegadora con los siguientes accesos
    Pokedex, Ecuentros, Habilidades, Objetos, Poke Radar, Search Bar
    esta barra quiero mantenerla en todas las paginas del sitio
    
    Definir Estilos, Letras y Colores (Imagenes limpias y sensillas)


    11 Ene 2025
    Modificar el pokemon-txt-to-json para que cuando escibe el nombre de la evolucion del pokemon lo escriba correctamente, lo mismo con la pre evolucion. En algunos casos lo hace mal. Por Ejemplo Farfetch'd y Sirfetch'd
    Ejemplo en el pokemon.json:

        "name": "Farfetch'd",
        "internal_name": "FARFETCHD",
        "evolutions": [
            {
                "name": "Sirfetchd", <--- Error
                "method": "Level",
                "item_or_condition": "36"
            }
        ],
        "pre_evolution": "Ninguna",
        "evolution_stage": 1

        "name": Sirfetch'd",
        "internal_name": "SIRFETCHD",    
        "pre_evolution": "Farfetch'd",
        "evolution_stage": 2


