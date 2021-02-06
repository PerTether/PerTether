
# Create your tests here.
import json
import numpy as np
from matplotlib import pyplot as plt
from scipy.interpolate import interp1d
import scipy.signal as signal


def proc_data(data, mean, interval):
    res = []
    tmp = np.array(data)
    x, y = tmp[:, 0], tmp[:, 1]
    for i in range(len(y)):
        if y[i] is None:
            y[i] = 0 if i == 0 else y[i - 1]
        res.append(int(y[i]))
    y = signal.medfilt(res, mean)
    x, y = x[0::interval], y[0::interval]
    d = np.dstack((x, y))
    return d[0].tolist()


def success_rate(request_rate, data):
    tmp = np.array(data)
    x = tmp[:, 0]
    y = tmp[:, 1]
    res = y / request_rate
    res = signal.medfilt(res, 3)
    d = np.dstack((x, res))
    return d[0].tolist()


def get_mean_by_period(data, start, finish):
    tmp = np.array(data)
    x = tmp[:, 0]
    y = tmp[:, 1]
    print(start, finish)
    start = np.where(x >= start)[0][0]
    if finish >= len(data):
        finish = -1
    if finish != -1:
        finish = np.where(x >= finish)[0][0]
    limit = y[start:finish]
    print(limit)
    mean = np.mean(limit)
    return np.around(mean, decimals=2)


def get_median_by_period(data, start, finish):
    tmp = np.array(data)
    x = tmp[:, 0]
    y = tmp[:, 1]
    start = np.where(x >= start)[0][0]
    if finish >= len(data):
        finish = -1
    if finish != -1:
        finish = np.where(x >= finish)[0][0]
    limit = y[start:finish]
    median = np.median(limit)
    return np.around(median, decimals=2)

