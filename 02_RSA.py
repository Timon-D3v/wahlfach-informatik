parts = [777973, 783266, 798383];
# Christi
e = 803;
n = 21680663;

#Ich
d = 18767767;
n_own = 34548089;

i=0;
for part in parts:
    parts[i] = part ** e % n;
    i += 1;

print(parts);
