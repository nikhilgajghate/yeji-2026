import matplotlib.pyplot as plt
import numpy as np


def main():
    m, b = 2, 1  # y = mx + b
    x = np.linspace(-10, 10, 200)
    print(x)
    y = m * x + b
    print(y)
    # plt.figure(figsize=(8, 6))
    # plt.plot(x, y, label=f"y = {m}x + {b}")
    # plt.axhline(0, color="black", linewidth=0.8)
    # plt.axvline(0, color="black", linewidth=0.8)
    # plt.xlabel("x")
    # plt.ylabel("y")
    # plt.title("Linear Function")
    # plt.legend()
    # plt.grid(True)
    # plt.show()


if __name__ == "__main__":
    main()
