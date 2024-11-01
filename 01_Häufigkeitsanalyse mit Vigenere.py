keylen = int(input("Keylength: "));
text = input("Text: ");
master = [];
results = [];
pos = 1;
for i in range(0, keylen):
    master.append(text[i::keylen]);
for i in master:
    results = [];
    for j in range(65, 91):
        results.append([
            chr(j),
            i.count(chr(j))
        ]);
    obj = [];
    for j in range(0, len(i)):
        obj.append([]);
        p = 0;
        for k in results:
            if (results[p][1] == j + 1):
                obj[j].append(results[p]);
            p += 1;
    print("Resultate von Position", pos);
    for j in range(0, len(obj)):
        if (len(obj[j]) > 0):
            for k in obj[j]:
                print(k[0], k[1]);
    pos += 1;
