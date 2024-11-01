def euclid(a, b):
    while (b != 0):
        h = a % b; # h = Divisionsrest von a durch b
        print(a, b, h);
        a = b;
        b = h;

    return a; # a ist der ggT von a und b

print(euclid(11, 7));
