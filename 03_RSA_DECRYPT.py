# RSA Decrypt

parts = [30860995, 21709714];
# Christi
e = 803;
n = 21680663;

#Ich
d = 18767767;
n_own = 34548089;

i=0;
for part in parts:
    parts[i] = part ** d % n;
    i += 1;

print(parts);
