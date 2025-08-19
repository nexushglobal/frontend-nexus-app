"use server";

interface LeadData {
    email: string;
    phone: string;
    message: string;
}

export async function createLead(data: LeadData) {
    try {
        const response = await fetch(`${process.env.API_BACKEND_URL}/api/events/create-lead`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.email,
                phone: data.phone,
                message: data.message,
                source: 'landing_page',
                timestamp: new Date().toISOString()
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error creating lead:', error);
        throw new Error('Failed to create lead. Please try again.');
    }
}