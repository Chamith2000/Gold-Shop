package com.example.gayangold.util;

import java.util.UUID;

public final class IdGenerator {
    private IdGenerator() {}

    public static String uuid(String prefix) {
        return prefix + "-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }

    public static String orderNumber() {
        return "ORD-" + System.currentTimeMillis() + "-" + (int) (Math.random() * 900 + 100);
    }

    public static String appointmentNumber() {
        return "APT-" + System.currentTimeMillis() + "-" + (int) (Math.random() * 900 + 100);
    }
}
