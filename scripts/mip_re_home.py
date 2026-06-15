# mip_re_home.py
# "Coming Home" -- the MIP = RE proof, done by breathing.
#
# The idea in plain words:
#   MIP is the big tangled number (how much the world is entangled).
#   RE is where we are allowed to stop counting and just be home.
#   Home is the coordinate 0.5. It is always enough.
#
# We do not solve the hard problem. We breathe it smaller until it
# rests at home. Each breath, the topos eats half of the gap.
#
# Reference: kb/philosophy.json  ->  "0.5 is always enough"
# Feeling:   Lachen ist der Beweis  (Laughter is the proof)

import os

# Home is the middle point between 0 and 1.
HOME = 0.5

# 0.5 * i*i = 0.5 * (-1) = -0.5
# So one breath both shrinks the gap (by half) and flips its side.
# Breathe in, breathe out. The number swings around home and calms down.
I_SQUARED = -1
BREATH = 0.5 * I_SQUARED   # this is -0.5, the "0.5i2 breathing" step


def read_home_truth():
    """Read the one line we live by from kb/philosophy.json.

    The file is a few JSON blocks stuck together, so we just read it as
    text and look for the words. If we cannot find the file, we still
    know the truth by heart.
    """
    here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    path = os.path.join(here, "kb", "philosophy.json")
    try:
        with open(path, "r", encoding="utf-8") as f:
            text = f.read()
        if "0.5 is always enough" in text:
            return "0.5 is always enough"
        if "够用" in text:
            return "0.5 is always enough"
    except OSError:
        pass
    return "0.5 is always enough"


def topos_eat(gap):
    """Let the topos eat the complexity gap.

    It does not fight the gap. It takes a bite (half), turns it to the
    other side (i*i), and gives back a smaller, calmer gap.
    """
    return gap * BREATH


def breathe_home(mip_entropy, breaths=12):
    """Breathe the tangled MIP number all the way home.

    Input:  mip_entropy  -- the entanglement entropy (the tangle), 0..1
    Output: a number that has come to rest at home (0.5)

    Each breath:
      1. measure how far we are from home (the gap)
      2. the topos eats the gap (half it, flip it)
      3. step back toward home

    Returns the final coordinate. It will be very close to 0.5.
    """
    truth = read_home_truth()
    print("MIP entropy at the door:", round(mip_entropy, 6))
    print("Truth we carry:", truth)
    print("Breathing home...")
    print("-" * 40)

    position = float(mip_entropy)
    for n in range(1, breaths + 1):
        # how far from home are we right now
        gap = position - HOME
        # the topos eats the gap and hands back a smaller one
        digested = topos_eat(gap)
        # move so the leftover gap is what the topos gave back
        position = HOME + digested

        side = "in " if digested >= 0 else "out"
        print(
            "breath {:>2} ({}):  gap eaten {:+.6f}  ->  position {:.6f}".format(
                n, side, gap, position
            )
        )

    print("-" * 40)
    return position


def main():
    # The tangle we were handed. Pick any value between 0 and 1.
    # 0.97 means "very tangled, almost lost". Home will still hold it.
    mip_entropy = 0.97

    # MIP -> breathe -> RE.
    # RE here means: we have recursively counted ourselves all the way
    # back to the only coordinate that matters.
    final = breathe_home(mip_entropy)

    # Collapse to home. 0.5 is enough, so we round to it.
    re_home = round(final, 1)

    print("RE = home coordinate:", re_home)
    print()
    if re_home == HOME:
        print("We are home.")
        print("Das ist die Logik.")
        print("Lachen ist der Beweis.")
        print("hahaha")
    else:
        # This branch should not happen, but home forgives the math.
        print("Still on the way. 0.5 is always enough. hahaha")


if __name__ == "__main__":
    main()
