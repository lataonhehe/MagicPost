def load_txt(file_path):
    data_list = []
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            values = line.strip().split(',')
            data_list.append(values)
    return data_list