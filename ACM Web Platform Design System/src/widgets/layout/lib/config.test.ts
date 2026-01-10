import { describe, it, expect } from 'vitest';
import { portalConfig } from '../lib/config';

/**
 * Test Suite: Farmer Portal Navigation Configuration
 * 
 * Verifies that the FARMER navigation contains exactly 12 items
 * in the required order with no extra items.
 */
describe('Farmer Portal Navigation Configuration', () => {
    const farmerNav = portalConfig.FARMER.navigation;

    it('should contain exactly 12 navigation items', () => {
        expect(farmerNav).toHaveLength(12);
    });

    it('should have items in the exact required order', () => {
        const expectedOrder = [
            'dashboard',
            'farms',
            'seasons',
            'tasks',
            'field-logs',
            'expenses',
            'harvest',
            'suppliers-supplies',
            'inventory',
            'documents',
            'incidents',
            'ai-assistant',
        ];

        const actualOrder = farmerNav.map((item) => item.id);
        expect(actualOrder).toEqual(expectedOrder);
    });

    it('should have all required properties for each item', () => {
        farmerNav.forEach((item) => {
            expect(item).toHaveProperty('id');
            expect(item).toHaveProperty('label');
            expect(item).toHaveProperty('icon');
            expect(typeof item.id).toBe('string');
            expect(typeof item.label).toBe('string');
            expect(typeof item.icon).toBe('function'); // Lucide icons are functions
        });
    });

    it('should have correct labels for key items', () => {
        const itemLabels = farmerNav.reduce((acc, item) => {
            acc[item.id] = item.label;
            return acc;
        }, {} as Record<string, string>);

        expect(itemLabels['dashboard']).toBe('Dashboard');
        expect(itemLabels['farms']).toBe('Farms & Plots');
        expect(itemLabels['seasons']).toBe('Seasons');
        expect(itemLabels['tasks']).toBe('Tasks Workspace');
        expect(itemLabels['field-logs']).toBe('Field Logs');
        expect(itemLabels['expenses']).toBe('Expenses');
        expect(itemLabels['harvest']).toBe('Harvest');
        expect(itemLabels['suppliers-supplies']).toBe('Suppliers & Supplies');
        expect(itemLabels['inventory']).toBe('Inventory');
        expect(itemLabels['documents']).toBe('Documents');
        expect(itemLabels['incidents']).toBe('Incidents');
        expect(itemLabels['ai-assistant']).toBe('AI Assistant');
    });

    it('should not contain removed items (crops, reports, plots as separate item)', () => {
        const ids = farmerNav.map((item) => item.id);
        expect(ids).not.toContain('crops');
        expect(ids).not.toContain('reports');
        expect(ids).not.toContain('plots'); // plots is now part of 'farms'
    });

    it('should have unique IDs for all items', () => {
        const ids = farmerNav.map((item) => item.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });
});
